package com.dothereco.DotheReco.service;

import com.dothereco.DotheReco.domain.EmptySlot;
import com.dothereco.DotheReco.domain.Fixed;
import com.dothereco.DotheReco.domain.Unfixed;
import com.dothereco.DotheReco.repository.FixedScheduleRepository;
import com.dothereco.DotheReco.repository.UnfixedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private FixedScheduleRepository fixedScheduleRepository;

    @Autowired
    private UnfixedRepository unfixedRepository;

    @Autowired
    private TmapApiService tmapApiService;

    // 예시로 고정된 키워드와 장소 목록을 클래스 변수로 정의합니다.
    private static final List<String> KEYWORDS = Arrays.asList("keyword1", "keyword2", "keyword3");
    private static final List<String> EXISTING_PLACES = Arrays.asList("PlaceA", "PlaceB", "PlaceC");

    @Transactional
    public List<Unfixed> scheduleFlexibleTasks() {
        List<Fixed> fixedSchedules = getTodayFixedSchedules();
        List<Unfixed> flexibleSchedules = getAllFlexibleSchedules();
        List<EmptySlot> emptySlots = classifyEmptySlots(fixedSchedules);
        Map<String, List<Unfixed>> classifiedSchedules = classifyFlexibleSchedules(flexibleSchedules);

        // 정렬
        classifiedSchedules.replaceAll((k, v) -> sortFlexibleSchedules(v));

        List<Unfixed> scheduledTasks = new ArrayList<>();
        List<Unfixed> todayDueSchedules = classifiedSchedules.values().stream()
                .flatMap(List::stream)
                .filter(schedule -> schedule.getUnfixedDeadline().isEqual(LocalDate.now()))
                .collect(Collectors.toList());

        // 오늘 마감인 유동 스케줄 배치
        for (EmptySlot slot : emptySlots) {
            int slotDuration = calculateTimeDifference(slot.getStartTime(), slot.getEndTime());
            scheduleTodayDueTasks(todayDueSchedules, slot, slotDuration, scheduledTasks);
        }

        // 일반 유동 스케줄 배치
        for (EmptySlot slot : emptySlots) {
            int slotDuration = calculateTimeDifference(slot.getStartTime(), slot.getEndTime());

            if (slot.getStartPlace().equals(slot.getEndPlace())) {
                scheduleFlexibleTasksByType(classifiedSchedules, slot, slotDuration, scheduledTasks, Arrays.asList("type3", "type1", "type2", "type4"));
            } else {
                scheduleFlexibleTasksByType(classifiedSchedules, slot, slotDuration, scheduledTasks, Arrays.asList("type3", "type2", "type4", "type1"));
            }
        }

        return scheduledTasks;
    }

    @Transactional
    private void scheduleTodayDueTasks(List<Unfixed> todayDueSchedules, EmptySlot slot, int slotDuration, List<Unfixed> scheduledTasks) {
        Iterator<Unfixed> iterator = todayDueSchedules.iterator();
        while (iterator.hasNext()) {
            Unfixed task = iterator.next();
            int taskDuration = calculateTimeDifference(task);
            int travelTime = tmapApiService.calculateTravelTime(slot.getStartPlace(), task.getPlace().getPlaceName());
            int totalDuration = taskDuration + travelTime;

            if (totalDuration <= slotDuration) {
                scheduledTasks.add(task);
                slotDuration -= totalDuration;
                iterator.remove();
            }
        }
    }

    @Transactional
    private void scheduleFlexibleTasksByType(Map<String, List<Unfixed>> classifiedSchedules, EmptySlot slot, int slotDuration, List<Unfixed> scheduledTasks, List<String> typeOrder) {
        for (String type : typeOrder) {
            List<Unfixed> tasks = classifiedSchedules.get(type);
            Iterator<Unfixed> iterator = tasks.iterator();
            while (iterator.hasNext()) {
                Unfixed task = iterator.next();
                int taskDuration = calculateTimeDifference(task);
                int travelTime = tmapApiService.calculateTravelTime(slot.getStartPlace(), task.getPlace().getPlaceName());
                int totalDuration = taskDuration + travelTime;

                if (totalDuration <= slotDuration && (task.getUnfixedDeadline().isEqual(LocalDate.now()) || (double) totalDuration / slotDuration <= 0.6)) {
                    scheduledTasks.add(task);
                    slotDuration -= totalDuration;
                    iterator.remove();
                }
            }
        }
    }

    private List<Fixed> getTodayFixedSchedules() {
        LocalDate today = LocalDate.now();
        return fixedScheduleRepository.findAllByFixedStartDay(today);
    }

    private List<Unfixed> getAllFlexibleSchedules() {
        return unfixedRepository.findAll();
    }

    private List<EmptySlot> classifyEmptySlots(List<Fixed> fixedSchedules) {
        List<EmptySlot> emptySlots = new ArrayList<>();

        for (int i = 0; i < fixedSchedules.size() - 1; i++) {
            Fixed current = fixedSchedules.get(i);
            Fixed next = fixedSchedules.get(i + 1);

            LocalTime endTime = current.getFixedEndTime();
            LocalTime startTime = next.getFixedStartTime();
            String startPlace = current.getPlace().getPlaceName();
            String endPlace = next.getPlace().getPlaceName();

            if (!endTime.equals(startTime)) {
                emptySlots.add(new EmptySlot(endTime.toString(), startTime.toString(), startPlace, endPlace));
            }
        }
        return emptySlots;
    }

    private Map<String, List<Unfixed>> classifyFlexibleSchedules(List<Unfixed> flexibleSchedules) {
        Map<String, List<Unfixed>> classifiedSchedules = new HashMap<>();

        classifiedSchedules.put("type1", new ArrayList<>());
        classifiedSchedules.put("type2", new ArrayList<>());
        classifiedSchedules.put("type3", new ArrayList<>());
        classifiedSchedules.put("type4", new ArrayList<>());

        for (Unfixed schedule : flexibleSchedules) {
            if (schedule.getPlace() == null) {
                classifiedSchedules.get("type1").add(schedule);
            } else if (schedule.getIsKeyword() != null && schedule.getIsKeyword()) {
                classifiedSchedules.get("type2").add(schedule);
            } else if (matchesExistingPlace(schedule.getPlace().getPlaceName())) {
                classifiedSchedules.get("type3").add(schedule);
            } else {
                classifiedSchedules.get("type4").add(schedule);
            }
        }
        return classifiedSchedules;
    }

    private boolean isKeyword(String placeName) {
        // 키워드인지 확인하는 로직을 추가합니다.
        return KEYWORDS.stream().anyMatch(placeName::contains);
    }

    private boolean matchesExistingPlace(String placeName) {
        // 기존 장소와 일치하는지 확인하는 로직을 추가합니다.
        return EXISTING_PLACES.contains(placeName);
    }

    private List<Unfixed> sortFlexibleSchedules(List<Unfixed> schedules) {
        schedules.sort(Comparator.comparing(Unfixed::getUnfixedDeadline)
                .thenComparing(Unfixed::getUnfixedImportance).reversed());
        return schedules;
    }

    private int calculateTimeDifference(Unfixed task) {
        return task.getUnfixedTime().getHour() * 60 + task.getUnfixedTime().getMinute();
    }

    private int calculateTimeDifference(String startTime, String endTime) {
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);
        return (int) ChronoUnit.MINUTES.between(start, end);
    }
}
