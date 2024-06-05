package com.dothereco.DotheReco.service;

import com.dothereco.DotheReco.domain.Place;
import com.dothereco.DotheReco.domain.Unfixed;
import com.dothereco.DotheReco.dto.UnfixedScheduleDTO;
import com.dothereco.DotheReco.repository.PlaceRepository;
import com.dothereco.DotheReco.repository.UnfixedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UnfixedService {
    private final UnfixedRepository unfixedRepository;
    private final CategoryService categoryService;
    private final PlaceRepository placeRepository;

    @Autowired
    public UnfixedService(UnfixedRepository unfixedRepository, CategoryService categoryService, PlaceRepository placeRepository) {
        this.unfixedRepository = unfixedRepository;
        this.categoryService = categoryService;
        this.placeRepository = placeRepository;
    }

    @Transactional
    public Unfixed createUnfixed(UnfixedScheduleDTO dto) {
        Unfixed unfixed = new Unfixed();
        mapDtoToUnfixed(dto, unfixed);
        return unfixedRepository.save(unfixed);
    }

    @Transactional
    public Unfixed updateUnfixed(Long id, UnfixedScheduleDTO dto) {
        Unfixed unfixed = unfixedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("유동 스케줄을 찾을 수 없습니다: " + id));
        mapDtoToUnfixed(dto, unfixed);
        return unfixedRepository.save(unfixed);
    }

    @Transactional(readOnly = true)
    public List<Unfixed> getAllUnfixed() {
        List<Unfixed> allUnfixed = unfixedRepository.findAll();
        allUnfixed.forEach(unfixed -> {
            if (unfixed.getPlace() != null) {
                unfixed.getPlace().getPlaceName(); // Trigger loading
            }
        });
        return allUnfixed.stream()
                .sorted(Comparator.comparing(Unfixed::isUnfixedCompleted)
                        .thenComparing(Unfixed::getScheduleDate))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<Unfixed> getUnfixedById(Long id) {
        Optional<Unfixed> unfixed = unfixedRepository.findById(id);
        unfixed.ifPresent(u -> {
            if (u.getPlace() != null) {
                u.getPlace().getPlaceName(); // Trigger loading
            }
        });
        return unfixed;
    }

    @Transactional
    public void deleteUnfixed(Long id) {
        Unfixed unfixed = unfixedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("유동 스케줄을 찾을 수 없습니다: " + id));
        unfixedRepository.delete(unfixed);
    }

    private void mapDtoToUnfixed(UnfixedScheduleDTO dto, Unfixed unfixed) {
        unfixed.setUnfixedTitle(dto.getUnfixedTitle());
        unfixed.setScheduleDate(dto.getScheduleDate());
        unfixed.setUnfixedTime(dto.getUnfixedTime());
        unfixed.setUnfixedDeadline(dto.getUnfixedDeadline());
        unfixed.setUnfixedImportance(Optional.ofNullable(dto.getUnfixedImportance()).orElse(3));
        unfixed.setUnfixedMemo(dto.getUnfixedMemo());
        unfixed.setUnfixedCompleted(false);
        unfixed.setUnfixedRecommended(false);
        unfixed.setReminderMark(false);

        // 카테고리 설정
        if (dto.getCategoryId() != null) {
            unfixed.setCategory(categoryService.getCategoryById(dto.getCategoryId()));
        } else {
            unfixed.setCategory(null);
        }

        // 장소 설정
        if (dto.getPlaceName() != null) {
            Optional<Place> place = placeRepository.findByPlaceName(dto.getPlaceName());
            if (place.isPresent()) {
                unfixed.setPlace(place.get());
            } else {
                Place newPlace = new Place();
                newPlace.setPlaceName(dto.getPlaceName());
                Place savedPlace = placeRepository.save(newPlace);
                unfixed.setPlace(savedPlace);
            }
        } else {
            unfixed.setPlace(null);
        }
    }
}
