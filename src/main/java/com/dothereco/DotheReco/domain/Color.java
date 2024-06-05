package com.dothereco.DotheReco.domain;

public enum Color {
    RED("#F0CAB9"),
    GREEN("#DBE9CD"),
    BLUE("#B9DEF0"),
    YELLOW("#FAE4A8"),
    ORANGE("#e2e2da"),
    PURPLE("#e9c6ff");
    private final String hexCode;


    Color(String hexCode) {
        this.hexCode = hexCode;
    }

    public String getHexCode() {
        return hexCode;
    }
}
