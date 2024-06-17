package com.dothereco.DotheReco.controller;

import com.dothereco.DotheReco.domain.Unfixed;
import com.dothereco.DotheReco.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/recommend")
    public List<Unfixed> recommendSchedules() {
        return scheduleService.scheduleFlexibleTasks();
    }
}
