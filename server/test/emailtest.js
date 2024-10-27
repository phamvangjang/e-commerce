const { Builder, By, until, Key } = require('selenium-webdriver');
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

(async function emailValidationTests() {
    // Khởi tạo driver
    // Mã màu ANSI cho văn bản xanh
    const red = '\x1b[31m';  // Màu đỏ
    const green = '\x1b[32m';  // Màu xanh
    const reset = '\x1b[0m';   // Đặt lại màu về mặc định
    const driver = await new Builder().forBrowser('chrome').build();

    // Danh sách kiểm thử
    const emailTests = [
        { description: "Email có độ dài tối thiểu hợp lệ", input: "a@b.co", expected: "" },
        { description: "Email có độ dài nhỏ hơn giới hạn tối thiểu", input: "a@b.c", expected: "Email invalid." },
        { description: "Email có độ dài tối đa hợp lệ", input: "phamnguyentrantongvodinhholedophanhoanggcioikjndwdmwelmfoweinoicniwnewioneiffwefiewnoifwebfefewfweoijfiewofweinifwephamnguyentrantongvodinhholedophanhoanggcioikjndwdmwelmfoweinoicniwnewioneiffwefiewnoifwebfefewfweoijfiewofweinifwephamnguyenttongv@gmail.com", expected: "" },
        { description: "Email vượt quá độ dài tối đa", input: "phamnguyentrantongvodinhholedophanhoanggcioikjndwdmwelmfoweinoicniwnewioneiffwefiewnoifwebfefewfweoijfiewofweinifwephamnguyentrantongvodinhholedophanhoanggcioikjndwdmwelmfoweinoicniwnewioneiffwefiewnoifwebfefewfweoijfiewofphdddamnguyenttong2322323232323v@gmail.com", expected: "This email field length too long" },
        { description: "Email có ký tự @ ở vị trí đầu tiên", input: "@test.com", expected: "Email invalid." },
        { description: "Email có ký tự @ ở vị trí cuối cùng", input: "example@", expected: "Email invalid." },
        { description: "Email có ký tự . ở đầu tên miền", input: "example@.com", expected: "Email invalid." },
        { description: "Email có ký tự . ở cuối tên miền", input: "example@test.com.", expected: "Email invalid." },
        { description: "Email có tên miền tối thiểu hợp lệ", input: "example@a.co", expected: "" },
        { description: "Email có tên miền nhỏ hơn giới hạn tối thiểu", input: "example@a.c", expected: "Email invalid." },
        { description: "Email có phần tên người dùng tối thiểu hợp lệ", input: "a@domain.com", expected: "" },
        { description: "Email thiếu phần tên người dùng", input: "@domain.com", expected: "Email invalid." },
        { description: "Email có nhiều ký tự @ liền nhau", input: "example@@domain.com", expected: "Email invalid." },
        { description: "Email có ký tự . liền nhau trong tên miền", input: "example@domain..com", expected: "Email invalid." },
        { description: "Email có ký tự đặc biệt hợp lệ trong tên", input: "ex.ample@test.com", expected: "" },
        { description: "Email có ký tự đặc biệt không hợp lệ trong tên", input: "example!@test.com", expected: "" },

    ];

    const passwordTests = [
        {
            description: "Kiểm tra minlength - Nhập 5 ký tự và không chứa ký tự đặc biệt",
            input: "abcde",
            expected: "Password minximum 6 characters.",
        },
        {
            description: "Kiểm tra minlength - Nhập 6 ký tự và không chứa ký tự đặc biệt",
            input: "abcdef",
            expected: "",
        },
        {
            description: "Kiểm tra minlength - Nhập 7 ký tự và không chứa ký tự đặc biệt",
            input: "abcdefg",
            expected: "",
        },
        {
            description: "Kiểm tra maxlength - Nhập 28 ký tự và không chứa ký tự đặc biệt",
            input: "abcdefghijklmnopqrstuvwxyzab",
            expected: "",
        },
        {
            description: "Kiểm tra maxlength - Nhập 29 ký tự và không chứa ký tự đặc biệt",
            input: "abcdefghijklmnopqrstuvwxyzabc",
            expected: "",
        },
        {
            description: "Kiểm tra maxlength - Nhập 30 ký tự và không chứa ký tự đặc biệt",
            input: "abcdefghijklmnopqrstuvwxyzabcd",
            expected: "Password maximum 29 characters.",
        },
    ];

    try {
        for (let test of emailTests) {
            await driver.get('http://localhost:3000/login'); // Thay đổi URL đến trang login của bạn

            // Mở trang web của bạn
            let emailField = await driver.wait(until.elementLocated(By.css('input[placeholder="Email"]')), 5000);

            // Nhập email vào trường input


            await emailField.sendKeys(test.input);
            // await driver.findElement(By.name('email')).sendKeys(test.input);

            // Nhấn nút đăng nhập
            await driver.findElement(By.css('button[type="button"]')).click();

            // Lấy thẻ small đầu tiên
            const messageElement = await driver.wait(until.elementLocated(By.xpath('(//small)[1]')), 5000);
            const messageText = await messageElement.getText();
            console.log(`${test.description}`);
            console.assert(messageText === test.expected, `Failed - Expected: ${test.expected}, but got: ${messageText}`);
            // In kết quả
            if (messageText === test.expected) {
                console.log(`${green} Passed${reset}`);
            } else {
                console.log(`${red} Failed${reset}`);
            }

            // Xóa input cho lần kiểm thử tiếp theo
            await emailField.clear();

        }
        for (let pass of passwordTests) {

            let emailField = await driver.wait(until.elementLocated(By.css('input[placeholder="Email"]')), 5000);
            if (emailField.getText() !== "") {
                await emailField.sendKeys(Key.CONTROL, 'a');
                await emailField.sendKeys(Key.DELETE);
            }

            // Mở trang web của bạn
            let passwordField = await driver.wait(until.elementLocated(By.css('input[placeholder="Password"]')), 5000);

            // Nhập email vào trường input

            await passwordField.sendKeys(pass.input);
            // await driver.findElement(By.name('email')).sendKeys(test.input);

            // Nhấn nút đăng nhập
            await driver.findElement(By.css('button[type="button"]')).click();

            // Lấy thẻ small đầu tiên
            const messageElement = await driver.wait(until.elementLocated(By.xpath('(//small)[2]')), 5000);
            const messageText = await messageElement.getText();
            console.log(`${pass.description}`);
            console.assert(messageText === pass.expected, `Failed - Expected: ${pass.expected}, but got: ${messageText}`);
            // In kết quả
            if (messageText === pass.expected) {
                console.log(`${green} Passed${reset}`);
            } else {
                console.log(`${red} Failed${reset}`);
            }

            // Xóa input cho lần kiểm thử tiếp theo
            await passwordField.sendKeys(Key.CONTROL, 'a');
            await passwordField.sendKeys(Key.DELETE);
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    } finally {
        await driver.quit();
    }
})();
