# EduDNS Filter - School Content Filtering Solution

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)

A DNS server with content filtering capabilities designed for educational institutions. Allows teachers to manage blocked domains and enables administrators to monitor network traffic and manage user accounts.

## Features

### For Teachers
- Add/remove domains from blocklist
- View list of currently blocked domains
- Simple web interface for management

### For Administrators
- Monitor real-time network traffic
- View logs of blocked requests
- Manage user accounts (create, update, delete)
- System health monitoring
- Export traffic statistics reports

## Technology Stack
- **Core**: Spring Boot 3.1.5
- **DNS Handling**: [dnsjava 3.5.3](https://github.com/dnsjava/dnsjava)
- **Security**: Spring Security 6.1.5
- **Database**: H2 (Embedded)
- **Web**: Bootstrap 5, Vue, jQuery
- **Tools**: Lombok, Maven

## Installation

### Prerequisites
- Java 17+
- Apache Maven

### Setup
1. Clone repository:
   ```bash
   git clone https://github.com/Demashqi/DNSResolver.git
