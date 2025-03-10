// package com.tus.EduDNSFilter.selenium;

// import static org.junit.Assert.assertThat;

// import org.junit.jupiter.api.AfterEach;
// import org.junit.jupiter.api.BeforeAll;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Tag;
// import org.junit.jupiter.api.Test;

// import org.openqa.selenium.By;
// import org.openqa.selenium.Dimension;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.WebElement;
// import org.openqa.selenium.chrome.ChromeDriver;

// import io.github.bonigarcia.wdm.WebDriverManager;
// import org.openqa.selenium.chrome.ChromeOptions;
// import org.openqa.selenium.interactions.Actions;

// // Generated by Selenium IDE
// import static org.hamcrest.CoreMatchers.is;

// @Tag("integration")
// public class loginAndAddDomainToBlockedListIT {
//     private WebDriver driver;

//     @BeforeAll
//     public static void setupClass() {
//         WebDriverManager.chromedriver().setup();
//     }

//     @BeforeEach
//     public void setupTest() {
//         ChromeOptions options = new ChromeOptions();
//         options.addArguments("--remote-allow-origins=*"); // Fix for Selenium 4+
//         driver = new ChromeDriver(options);
//     }

//     @AfterEach
//     public void teardown() {
//         if (driver != null) {
//             driver.quit();
//         }
//     }

//     private void waitForStep() {
//       try {
//           Thread.sleep(3000); // 1 second delay
//       } catch (InterruptedException e) {
//           e.printStackTrace();
//       }
//   }

//     @Test
//   public void loginAndAddDomainToBlockedList() {
//     // Test name: loginAndAddDomainToBlockedList
//     // Step # | name | target | value
//     // 1 | open | http://localhost:9091/ | 
//     driver.get("http://localhost:9091/");
//     // 2 | setWindowSize | 1936x1048 | 
//     driver.manage().window().setSize(new Dimension(1936, 1048));
//     // 3 | click | id=username | 
//     driver.findElement(By.id("username")).click();
//     // 4 | type | id=username | admin
//     driver.findElement(By.id("username")).sendKeys("admin");
//     // 5 | type | id=password | admin
//     driver.findElement(By.id("password")).sendKeys("admin");
//     // 6 | click | css=.btn | 
//     driver.findElement(By.cssSelector(".btn")).click();
//     waitForStep();
//     // 7 | click | id=roleDropdown | 
//     driver.findElement(By.id("roleDropdown")).click();
//     // 8 | click | linkText=Teacher | 
//     driver.findElement(By.linkText("Teacher")).click();
//     // 9 | mouseOver | css=.btn-sm:nth-child(2) | 
//     waitForStep();
//     {
//       WebElement element = driver.findElement(By.cssSelector(".btn-sm:nth-child(2)"));
//       Actions builder = new Actions(driver);
//       builder.moveToElement(element).perform();
//     }
//     // 10 | click | css=.btn-sm:nth-child(2) | 
//     driver.findElement(By.cssSelector(".btn-sm:nth-child(2)")).click();
//     // 11 | mouseOut | css=.btn-sm:nth-child(2) | 
//     {
//       WebElement element = driver.findElement(By.tagName("body"));
//       Actions builder = new Actions(driver);
//       builder.moveToElement(element, 0, 0).perform();
//     }
//     // 12 | click | id=domain | 
//     driver.findElement(By.id("domain")).click();
//     // 13 | type | id=domain | tus.ie
//     driver.findElement(By.id("domain")).sendKeys("tus.ie");
//     // 14 | mouseOver | id=saveBlockedDomain | 
//     {
//       WebElement element = driver.findElement(By.id("saveBlockedDomain"));
//       Actions builder = new Actions(driver);
//       builder.moveToElement(element).perform();
//     }
//     // 15 | click | id=saveBlockedDomain | 
//     driver.findElement(By.id("saveBlockedDomain")).click();
//     // 16 | mouseOut | id=saveBlockedDomain | 
//     {
//       WebElement element = driver.findElement(By.tagName("body"));
//       Actions builder = new Actions(driver);
//       builder.moveToElement(element, 0, 0).perform();
//     }
//     // 17 | assertText | id=blockedDomainsTable_info | Showing 1 to 1 of 1 entries
//     assertThat(driver.findElement(By.id("blockedDomainsTable_info")).getText(), is("Showing 1 to 2 of 2 entries"));
//   }

// }
