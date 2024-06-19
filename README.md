# DotheRECO(Do the recommendation)

**자동으로 스케줄링을 해주는 일정관리 서비스**

---
<p align="center">
<img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/3444ba54-f85c-43f0-942f-3ca5ac0bdf8c">
</p>

### 프로젝트 설명

---

**시간대 추천 기능과 일정 추천 기능을 이용하여 자동으로 일정을 스케줄링 해주는 일정관리 서비스**

### 팀원 소개

---


[이예은](https://github.com/orgs/steamTheRECO/people/YaeEun2): 팀장, 백엔드   
[전재은](https://github.com/orgs/steamTheRECO/people/JeonJaeeun): 프론트엔드   
[김지후](https://github.com/orgs/steamTheRECO/people/Kim-jihoo): 백엔드

### 프로젝트 실행 방법

---
빌드 방법

- 레포지토리를 클론하여 로컬에서 동작시킬 수 있다.

```java
git clone [https://github.com/steamTheRECO/DotheReco.git](https://github.com/steamTheRECO/DotheReco.git)
```

- src/main/resources 폴더에 application.yml 파일을 넣어 코드를 빌드 할 수 있다.

```java
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://******/*******
    username: ****
    password: ****
  jpa:
    database: mysql
    database-platform: org.hibernate.dialect.MySQL8Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
    open-in-view: false
```

- terminal에 아래 명령어를 입력하여 프론트엔드를 실행할 수 있다.

```java
PS C:\DotheReco> cd src/main/frontend
PS C:\DotheReco\src\main\frontend> npm start
```

- 인텔리제이 상단 메뉴에서 ‘Build’ > ‘Build Project’를 클릭하여 빌드 할 수 있고 ‘Run’ 아이콘을 클릭하여 애플리케이션을 실행할 수 있다.

### 서비스 소개

---

1. **일정 추가 기능**

메인화면에서 유동스케줄과 일반스케줄을 추가할 수 있다.

- 일반스케줄 입력: 제목, 날짜 및 시간, 장소, 카테고리, 메모
- 유동스케줄 입력: 제목, 예상 소요시간, 마감기한, 요일 반복, 중요도, 장소, 카테고리, 메모
<p align="center">
<img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/64bfd099-44b1-477a-abf1-8f87958b0e13">
</p>

2. **시간대 추천 기능**

이미 정해져 있는 일반스케줄 사이의 빈 시간대를 확인해볼 수 있는 시간대 추천 기능을 사용할 수 있다.

<p align="center">
  <img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/8e123bc1-80d1-42b2-aef2-39a664e4755a">
</p>

3. **일정 추천 기능**

미리 추가했던 일반스케줄과 유동스케줄을 이용하여 일정 추천 기능을 사용할 수 있다.

<p align="center">
  <img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/0e7736ec-5e39-4015-bfb9-7a5b19043331">
</p>

### 사용한 오픈소스

---

**TMAP API**

- 링크: [https://tmapapi.tmapmobility.com/](https://tmapapi.tmapmobility.com/)
- TMAP API에서 POI 검색, 지도보기, 보행자 경로안내 기능 사용

<p align="center">
  <img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/d27f07db-eb94-49dc-abce-44e29314f280">
</p>

### 기술 스택

---

| 종류 | 사용 도구 |
| --- | --- |
| Backend | Java, Spring Boot |
| Frontend | CSS, JavaScript, React(jsx) |
| DevOps & Tool | MySQL, AWS EC2, AWS S3, GitHub Actions, Docker, IntelliJ, GitKraken |

### 소프트웨어 구조도

---
<p align="center">
  <img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/6322738f-4fdf-4356-a8cb-3f50cd66f459">
</p>

### ERD

---

<p align="center">
  <img src="https://github.com/steamTheRECO/DotheReco/assets/109203288/67df1329-c04e-416e-aedb-7ff229e6e9b5">
</p>
