# WebConsoleTap ![](src/icons/webconsoletap-48.png)

Simple extension based on [JSErrorCollector](https://github.com/mguillem/JSErrorCollector) used to tap into JavaScript errors and warnings and allow fetching them later, e.g. via [WebDriver](https://www.seleniumhq.org/projects/webdriver/) JS Interface.

## Manual usage example:
* load the extension
* perform the actions which generate some logs (e.g. test the page/webapp)
* call console.requestDump()
* call console.getDump(), if the response is undefined, retry after a slight delay (depending on the amount of logs needed to be transfered)

## WebDriver usage example:
* load the extension
```
// Create a FirefoxProfile and add the extension
FirefoxProfile fxprofile = new FirefoxProfile();
File xpiFile = new File("xpi/webconsoletap-1.0-fx.xpi");
if (xpiFile.exists()) {
    fxprofile.addExtension(xpiFile);
    logger.info("Enabled addon: " + xpiFile.getName());
}

// Build FirefoxOptions
FirefoxOptions fxopt = new FirefoxOptions();
fxopt.setCapability(FirefoxDriver.PROFILE, fxprofile);

// And finally get a local WebDriver object
WebDriver drv = new FirefoxDriver(ffOpt);

// Or a remote WebDriver (when using Selenium Grid):
WebDriver drv = new RemoteWebDriver(new URL("http://your_hub_host:4455/wd/hub"), ffOpt);
```
* let your tests run
* after the test, call requestDump() and wait for getDump() to return some content:
```
String consoleLog = null;
try {
    ((JavascriptExecutor) drv).executeScript("window.console.requestDump()");
    int tries = 10;
    while (consoleLog == null && tries-- > 0) {
        consoleLog = (String)((JavascriptExecutor) drv).executeScript("return window.console.getDump();");
        if (consoleLog == null)
            Thread.sleep(250);
    }
} catch (JavascriptException e) {
// handle exception, e.g. if you forget to load the exception
} catch (InterruptedException e) {
// handle exception
}
```

## Example JSON output:
```
[
  {
    "timestamp":"2019-02-19 11:01:06.184",
    "type":"INFO",
    "message":["Feb-19 11:01:06.183 [INFO] InvalidMsgFromChildWindow: {\"isTrusted\":true}"],
    "url":"https://some/url/here"
  },
  {
    "timestamp":"2019-02-19 11:01:10.312",
    "type":"ERROR",
    "message":["Feb-19 11:01:10.312 [ERROR] ReferenceError: $ is not defined"],
    "url":"https://some/url/here"
  },
  ...
]

```

## Parsing the above to a file using com.google.gson and java.nio.file:
```
Type listType = new TypeToken<List<Map<String, Object>>>() {}.getType();
List<Map<String, Object>> parsedLogs = new Gson().fromJson(consoleLog, listType);

if (parsedLogs.size() > 0) {
    // store it in a file
    File log = new File(String.format("output/console-logs-%s.log", ((RemoteWebDriver)drv).getSessionId() ));
    BufferedWriter writer = null;
    try {
        writer = Files.newBufferedWriter(log.toPath(), Charset.forName("UTF-8"), new OpenOption[] { WRITE, CREATE_NEW });
        for (Map<String, Object> logEntry : parsedLogs) {
            writer.write(String.format("[%s] [%5s] %s at %s\n",
                (String)logEntry.get("timestamp"),
                (String)logEntry.get("type"),
                Joiner.on(", ").join((List<String>)logEntry.get("message")),
                (String)logEntry.get("url")
            ));
        }
        writer.close();
    } catch (IOException e) {
        // handle errors (e.g. log the json somewhere directly)
    }
}

```
Example output:
```
[2019-02-19 11:01:06.184] [ INFO] Feb-19 11:01:06.183 [INFO] InvalidMsgFromChildWindow: {\"isTrusted\":true} at https://some/url/here
[2019-02-19 11:01:10.312] [ERROR] Feb-19 11:01:10.312 [ERROR] ReferenceError: $ is not defined at https://some/url/here
```


Icon made by [srip](https://www.flaticon.com/authors/srip) from [www.flaticon.com](https://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/).
