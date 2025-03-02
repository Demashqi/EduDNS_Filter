# EduDNS Filter - School Content Filtering Solution

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)

A DNS server with content filtering capabilities designed for educational institutions. Allows teachers to manage blocked domains and enables administrators to monitor network traffic and manage user accounts.

## Demo Video - Sample for now

[![EduDNS Filter Demo](https://img.youtube.com/vi/9XMMEPWkuOs/0.jpg)](https://www.youtube.com/watch?v=9XMMEPWkuOs)

## Features

### For Teachers
- Add/remove domains from blocklist
- View list of currently blocked domains
- Simple web interface for management

### For Administrators
- Monitor real-time network traffic
- View logs of blocked requests
- Manage user accounts (create, update, delete)
- Automatic DNS configuration files for Windows

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
   ```
2. Navigate into the project directory:
   ```bash
   cd DNSResolver
   ```
3. Build the project:
   ```bash
   mvn clean install
   ```
4. Run the application
   ```bash
   mvn spring-boot:run
   ```
5. After running the application, open your browser and go to:
   ```
   http://localhost:9091
   ```
6. Log in using:
   - **Username**: `admin`
   - **Password**: `admin`

7. On the sidebar menu, download the following files:
   - **"Configure DNS Server"**: A batch file for setting up DNS on Windows (must be run with administrator privileges).
   - **"Restore DNS Settings"**: A batch file for restoring the default DNS settings (must be run with administrator privileges).


## API Documentation

For detailed API documentation, refer to the Postman collection:

[EduDNS Filter API Documentation](https://documenter.getpostman.com/view/39743668/2sAYdimUYr)

## License
This project is part of an assignment submitted to Technological University of the Shannon: Midlands Midwest for the Web Technologies module in the Master of Science in Applied Software Engineering.


