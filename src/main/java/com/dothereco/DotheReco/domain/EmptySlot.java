package com.dothereco.DotheReco.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmptySlot {
    private String startTime;
    private String endTime;
    private String startPlace;
    private String endPlace;
}