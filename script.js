const http = require("https");
const rl = require("readline-sync");
// const webdriver = require("selenium-webdriver");
const { Builder, By, Key, until } = require("selenium-webdriver");

http.get(
  "https://api.mojang.com/users/profiles/minecraft/autisticdurken@gmail.com"
);

const authenticateUser = () => {
  const authData = {
    agent: {
      name: "Minecraft",
      version: 1
    },
    username: "",
    password: "",
    requestUser: true
  };
  const name = rl.question("Minecraft username: ");
  const pass = rl.question("Minecraft password: ");
  authData.username = name;
  authData.password = pass;
  // username: "autisticdurken@gmail.com",
  // password: "Test1234@"
  const authReqOptions = {
    hostname: "authserver.mojang.com",
    path: "/authenticate",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": JSON.stringify(authData).length
    }
  };
  const authReq = http.request(authReqOptions, res => {
    console.log("requested: ", authData);
    console.log("status code: ", res.statusCode);
    res.on("data", d => {
      process.stdout.write(d);
    });
  });
  authReq.on("error", error => {
    console.error(error);
  });
  authReq.write(JSON.stringify(authData));
  authReq.end();
};

let driver = new Builder().forBrowser("firefox").build();

driver.get("https://my.minecraft.net/en-us/profile/").then(() => {
  driver.getTitle().then(title => {
    console.log(title);

    const profileName = rl.question("What name do you want to snipe?: ");
    const userPassword = rl.question("Confirm your password: ");
    const lastChar = profileName.charAt(profileName.length - 1);

    const initializeDataCheck = () => {
      driver
        .findElement(By.id("profileName"))
        .sendKeys(profileName)
        .then(() => {
          driver.findElement(By.id("currentPassword")).sendKeys(userPassword);
        });
      const myInterval = setInterval(() => {
        if (driver.findElement(By.id("profileNameChangeError"))) {
          driver.findElement(By.id("profileName")).sendKeys(Key.BACK_SPACE);
          setTimeout(() => {
            driver.findElement(By.id("profileName")).sendKeys(lastChar);
          }, 500);
        } else {
          console.log("COMPLETED");
          // clearInterval(myInterval);
        }
      }, 500);
    };

    let start = false;
    while (!start) {
      const ask = rl.question(
        'YOU MUST LOG IN TO START! Type "start" to start sniping or "quit" to quit: '
      );
      if (ask === "start") {
        start === true;
        initializeDataCheck();
        break;
      } else if (ask === "quit") {
        driver.quit();
        break;
      }
    }

    // setTimeout(() => {
    //   driver.quit();
    // }, 5000);
  });
});
