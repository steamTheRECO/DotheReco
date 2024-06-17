package com.dothereco.DotheReco.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@Service
public class TmapApiService {
    private static final String API_KEY = "0ZSTJ6jGf15NagHDb0wOT5Q06tnZG7Yw2vKYVzqo"; // Tmap API 키를 넣으세요.

    public Map<String, String> getCoordinates(String placeName) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("appKey", API_KEY);

        String url = String.format("https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=%s&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=1",
                placeName);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> result = response.getBody();

        if (result != null && result.containsKey("searchPoiInfo")) {
            Map<String, Object> searchPoiInfo = (Map<String, Object>) result.get("searchPoiInfo");
            if (searchPoiInfo.containsKey("pois")) {
                Map<String, Object> pois = (Map<String, Object>) searchPoiInfo.get("pois");
                if (pois.containsKey("poi")) {
                    List<Map<String, Object>> poiList = (List<Map<String, Object>>) pois.get("poi");
                    if (!poiList.isEmpty()) {
                        Map<String, Object> poi = poiList.get(0);
                        String lat = (String) poi.get("frontLat");
                        String lon = (String) poi.get("frontLon");
                        return Map.of("lat", lat, "lon", lon);
                    }
                }
            }
        }
        return Map.of("lat", "0.0", "lon", "0.0"); // 기본 좌표를 반환합니다.
    }

    public int calculateTravelTime(String startPlace, String endPlace) {
        Map<String, String> startCoords = getCoordinates(startPlace);
        Map<String, String> endCoords = getCoordinates(endPlace);

        String startX = startCoords.get("lon");
        String startY = startCoords.get("lat");
        String endX = endCoords.get("lon");
        String endY = endCoords.get("lat");

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("appKey", API_KEY);

        String url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json";

        String body = String.format(
                "{\"startX\":\"%s\", \"startY\":\"%s\", \"endX\":\"%s\", \"endY\":\"%s\", \"reqCoordType\":\"WGS84GEO\", \"resCoordType\":\"EPSG3857\"}",
                startX, startY, endX, endY
        );

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        Map<String, Object> result = response.getBody();

        if (result != null && result.containsKey("features")) {
            List<Map<String, Object>> features = (List<Map<String, Object>>) result.get("features");
            if (!features.isEmpty()) {
                Map<String, Object> properties = (Map<String, Object>) features.get(0).get("properties");
                if (properties != null && properties.containsKey("totalTime")) {
                    return (int) properties.get("totalTime");
                }
            }
        }
        return -1; // 이동 시간을 계산할 수 없는 경우
    }
}
