package com.dothereco.DotheReco.controller;


import com.dothereco.DotheReco.domain.Unfixed;
import com.dothereco.DotheReco.dto.UnfixedScheduleDTO;
import com.dothereco.DotheReco.service.UnfixedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/unfixed-schedules")
public class UnfixedController {

    private final UnfixedService unfixedService;

    @Autowired
    public UnfixedController(UnfixedService unfixedService) {
        this.unfixedService = unfixedService;
    }

    // 특정 유동 스케줄 조회
    @GetMapping("/{id}")
    public ResponseEntity<Unfixed> getUnfixedScheduleById(@PathVariable Long id) {
        Optional<Unfixed> unfixed = unfixedService.getUnfixedById(id);
        return unfixed.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 유동 스케줄 생성
    @PostMapping
    public ResponseEntity<Unfixed> createUnfixedSchedule(@RequestBody UnfixedScheduleDTO unfixedDto) {
        Unfixed unfixed = unfixedService.createUnfixed(unfixedDto);
        return ResponseEntity.ok(unfixed);
    }

    // 유동 스케줄 수정
    @PutMapping("/{id}")
    public ResponseEntity<Unfixed> updateUnfixedSchedule(@PathVariable Long id, @RequestBody UnfixedScheduleDTO unfixedDto) {
        Unfixed unfixed = unfixedService.updateUnfixed(id, unfixedDto);
        return ResponseEntity.ok(unfixed);
    }

    // 유동 스케줄 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnfixedSchedule(@PathVariable Long id) {
        unfixedService.deleteUnfixed(id);
        return ResponseEntity.noContent().build();
    }
}
