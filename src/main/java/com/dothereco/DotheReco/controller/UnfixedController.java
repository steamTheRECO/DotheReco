package com.dothereco.DotheReco.controller;

import com.dothereco.DotheReco.domain.Unfixed;
import com.dothereco.DotheReco.dto.UnfixedScheduleDTO;
import com.dothereco.DotheReco.service.UnfixedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/unfixed-schedules")
public class UnfixedController {

    private final UnfixedService unfixedService;

    @Autowired
    public UnfixedController(UnfixedService unfixedService) {
        this.unfixedService = unfixedService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public ResponseEntity<List<UnfixedScheduleDTO>> getAllUnfixedSorted() {
        List<Unfixed> sortedUnfixed = unfixedService.getAllUnfixed();
        List<UnfixedScheduleDTO> dtoList = sortedUnfixed.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<UnfixedScheduleDTO> getUnfixedScheduleById(@PathVariable("id") Long id) { // 수정
        Optional<Unfixed> unfixed = unfixedService.getUnfixedById(id);
        return unfixed.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping
    public ResponseEntity<UnfixedScheduleDTO> createUnfixedSchedule(@RequestBody UnfixedScheduleDTO unfixedDto) { // 수정
        Unfixed unfixed = unfixedService.createUnfixed(unfixedDto);
        return ResponseEntity.ok(convertToDto(unfixed));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnfixedScheduleDTO> updateUnfixedSchedule(@PathVariable("id") Long id, @RequestBody UnfixedScheduleDTO unfixedDto) { // 수정
        Unfixed unfixed = unfixedService.updateUnfixed(id, unfixedDto);
        return ResponseEntity.ok(convertToDto(unfixed));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnfixedSchedule(@PathVariable("id") Long id) {
        unfixedService.deleteUnfixed(id);
        return ResponseEntity.noContent().build();
    }

    private UnfixedScheduleDTO convertToDto(Unfixed unfixed) {
        UnfixedScheduleDTO dto = new UnfixedScheduleDTO();
        dto.setUnfixedCode(unfixed.getUnfixedCode()); // 추가
        dto.setUnfixedTitle(unfixed.getUnfixedTitle());
        dto.setScheduleDate(unfixed.getScheduleDate());
        dto.setUnfixedTime(unfixed.getUnfixedTime());
        dto.setUnfixedDeadline(unfixed.getUnfixedDeadline());
        dto.setUnfixedImportance(unfixed.getUnfixedImportance());
        dto.setUnfixedMemo(unfixed.getUnfixedMemo());
        dto.setCategoryId(unfixed.getCategory() != null ? unfixed.getCategory().getCategoryCode() : null);
        dto.setPlaceName(unfixed.getPlace() != null ? unfixed.getPlace().getPlaceName() : null);
        dto.setIsKeyword(unfixed.getIsKeyword());
        return dto;
    }
}
