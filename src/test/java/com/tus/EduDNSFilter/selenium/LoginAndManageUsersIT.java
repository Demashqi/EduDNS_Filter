package com.tus.EduDNSFilter.selenium;

import static org.junit.Assert.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;

// Generated by Selenium IDE
import static org.hamcrest.CoreMatchers.is;

@Tag("integration")
public class LoginAndManageUsersIT {
    private WebDriver driver;

    @BeforeAll
    public static void setupClass() {
        WebDriverManager.chromedriver().setup();
    }

    @BeforeEach
    public void setupTest() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*"); // Fix for Selenium 4+
        driver = new ChromeDriver(options);
    }

    @AfterEach
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private void waitForStep() {
      try {
          Thread.sleep(3000); // 1 second delay
      } catch (InterruptedException e) {
          e.printStackTrace();
      }
  }

  @Test
  public void loginAndManageUsers() {
    // Test name: loginAndManageUsers
    // Step # | name | target | value
    // 1 | open | http://localhost:9091/ | 
    driver.get("http://localhost:9091/");
    // 2 | setWindowSize | 1936x1048 | 
    driver.manage().window().setSize(new Dimension(1936, 1048));
    // 3 | click | id=username | 
    driver.findElement(By.id("username")).click();
    // 4 | type | id=username | admin
    driver.findElement(By.id("username")).sendKeys("admin");
    // 5 | click | id=password | 
    driver.findElement(By.id("password")).click();
    // 6 | type | id=password | admin
    driver.findElement(By.id("password")).sendKeys("admin");
    // 7 | click | css=.btn | 
    driver.findElement(By.cssSelector(".btn")).click();
    waitForStep();
    // 8 | click | css=.list-group-item:nth-child(3) > .m-3 | 
    driver.findElement(By.cssSelector(".list-group-item:nth-child(3) > .m-3")).click();
    // 9 | mouseOver | css=.list-group-item:nth-child(3) > .m-3 | 
    {
      WebElement element = driver.findElement(By.cssSelector(".list-group-item:nth-child(3) > .m-3"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element).perform();
    }
    waitForStep();
    // 10 | mouseOut | css=.active > .m-3 | 
    {
      WebElement element = driver.findElement(By.tagName("body"));
      Actions builder = new Actions(driver);
      builder.moveToElement(element, 0, 0).perform();
    }
    // 11 | click | css=.d-flex > .btn | 
    driver.findElement(By.cssSelector(".d-flex > .btn")).click();
    // 12 | click | id=username | 
    waitForStep();
    driver.findElement(By.id("username")).click();
    // 13 | type | id=username | admin1
    driver.findElement(By.id("username")).sendKeys("admin_random");
    // 14 | click | id=password | 
    driver.findElement(By.id("password")).click();
    // 15 | type | id=password | admin
    driver.findElement(By.id("password")).sendKeys("admin");
    // 16 | click | id=role | 
    driver.findElement(By.id("role")).click();
    // 17 | select | id=role | label=Administrator
    {
      WebElement dropdown = driver.findElement(By.id("role"));
      dropdown.findElement(By.xpath("//option[. = 'Administrator']")).click();
    }
    // 18 | click | id=saveUser | 
    driver.findElement(By.id("saveUser")).click();
    // 19 | assertText | id=usersTable_info | Showing 1 to 2 of 2 entries
    // user added
    waitForStep();
    assertThat(driver.findElement(By.id("usersTable_info")).getText(), is("Showing 1 to 2 of 2 entries"));
    // 20 | assertText | css=.even > td:nth-child(3) | ADMIN,TEACHER
    // Admin got 2 roles: Admin and Teacher
    // assertThat(driver.findElement(By.cssSelector(".even > td:nth-child(3)")).getText(), is("ADMIN,TEACHER"));
    // 21 | click | css=.even .btn-primary | 
    // driver.findElement(By.cssSelector(".even .btn-primary")).click();
    // // 22 | click | id=role | 
    // driver.findElement(By.id("role")).click();
    // // 23 | select | id=role | label=Teacher
    // {
    //   WebElement dropdown = driver.findElement(By.id("role"));
    //   dropdown.findElement(By.xpath("//option[. = 'Teacher']")).click();
    // }
    // // 24 | click | id=saveUser | 
    // driver.findElement(By.id("saveUser")).click();
    // // 25 | assertText | css=.even > td:nth-child(3) | TEACHER
    // // edited user role: changed from admin to Teacher
    // assertThat(driver.findElement(By.cssSelector(".even > td:nth-child(3)")).getText(), is("TEACHER"));
    // 26 | click | css=.even .btn-danger | 
    driver.findElement(By.cssSelector(".even .btn-danger")).click();
    // 27 | click | id=confirmDelete | 
    waitForStep();
    driver.findElement(By.id("confirmDelete")).click();
    // 28 | assertText | id=usersTable_info | Showing 1 to 1 of 1 entries
    // User Deleted 
    waitForStep();
    assertThat(driver.findElement(By.id("usersTable_info")).getText(), is("Showing 1 to 1 of 1 entries"));
  }

}