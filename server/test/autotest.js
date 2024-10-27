const { Builder, By, until, Key } = require('selenium-webdriver');

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function testLoginInput() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Mở trang login
        await driver.get('http://localhost:3000/login'); // Đổi thành URL thực tế của bạn

        // Chờ cho trường "Email" xuất hiện
        let emailField = await driver.wait(until.elementLocated(By.css('input[placeholder="Email"]')), 5000);
        let passwordField = await driver.wait(until.elementLocated(By.css('input[placeholder="Password"]')), 5000);

        await driver.findElement(By.css('button[type="button"]')).click();

        // 1. Kiểm tra giá trị mặc định rỗng cho email
        console.log('Kiểm tra giá trị mặc định rỗng cho email');
        let emailDefaultValue = await emailField.getAttribute('value');
        console.assert(emailDefaultValue === '', 'Giá trị mặc định của email không rỗng');

        // 2. Kiểm tra bắt buộc nhập (không nhập dữ liệu cho email)
        console.log('Kiểm tra bắt buộc nhập cho email');
        await emailField.sendKeys(Key.CONTROL, 'a');
        await emailField.sendKeys(Key.DELETE);
        await driver.findElement(By.css('button[type="button"]')).click();
        let emailErrorMessage = await driver.wait(until.elementLocated(By.css('small')), 5000);
        console.assert(await emailErrorMessage.getText() === 'Require this field', 'Không xuất hiện thông báo lỗi khi không nhập email');

        // 3. Kiểm tra nhập email hợp lệ
        console.log('Kiểm tra nhập email hợp lệ');
        await emailField.sendKeys(Key.CONTROL, 'a');
        await emailField.sendKeys(Key.DELETE);
        await emailField.sendKeys('thao16068@gmail.com');
        await driver.findElement(By.css('button[type="button"]')).click();
        console.assert(await emailField.getAttribute('value') === 'thao16068@gmail.com', 'Không chấp nhận email hợp lệ');

        // 4. Kiểm tra nhập email không hợp lệ
        console.log('Kiểm tra nhập email không hợp lệ');
        await emailField.sendKeys(Key.CONTROL, 'a');
        await emailField.sendKeys(Key.DELETE);
        await emailField.sendKeys('invalid-email');
        await driver.findElement(By.css('button[type="button"]')).click();
        emailErrorMessage = await driver.findElement(By.css('small'));

        console.assert(await emailErrorMessage.getText() === 'Email invalid.', 'Không xuất hiện thông báo lỗi khi nhập email không hợp lệ');

        // 5. Kiểm tra giá trị mặc định rỗng cho mật khẩu
        console.log('Kiểm tra giá trị mặc định rỗng cho mật khẩu');
        let passwordDefaultValue = await passwordField.getAttribute('value');
        console.assert(passwordDefaultValue === '', 'Giá trị mặc định của mật khẩu không rỗng');

        // 6. Kiểm tra bắt buộc nhập (không nhập dữ liệu cho mật khẩu)
        console.log('Kiểm tra bắt buộc nhập cho mật khẩu');
        await passwordField.sendKeys(Key.CONTROL, 'a'); // Chọn toàn bộ nội dung
        await passwordField.sendKeys(Key.DELETE); // Xóa nội dung đã chọn
        await driver.findElement(By.css('button[type="button"]')).click();
        let passwordErrorMessage = await driver.wait(until.elementLocated(By.xpath("(//small)[2]")), 5000); // XPath chọn phần tử <small> thứ 2
        console.assert(await passwordErrorMessage.getText() === 'Require this field', 'Không xuất hiện thông báo lỗi khi không nhập mật khẩu');

        // 7. Kiểm tra nhập mật khẩu hợp lệ
        console.log('Kiểm tra nhập mật khẩu hợp lệ');
        await passwordField.sendKeys(Key.CONTROL, 'a'); // Chọn toàn bộ nội dung
        await passwordField.sendKeys(Key.DELETE); // Xóa nội dung đã chọn
        await passwordField.sendKeys('123456');
        await driver.findElement(By.css('button[type="button"]')).click();
        console.assert(await passwordField.getAttribute('value') === '123456', 'Không chấp nhận mật khẩu hợp lệ');

        // 8. Kiểm tra nhập mật khẩu không hợp lệ
        console.log('Kiểm tra nhập mật khẩu không hợp lệ');
        await passwordField.sendKeys(Key.CONTROL, 'a'); // Chọn toàn bộ nội dung
        await passwordField.sendKeys(Key.DELETE); // Xóa nội dung đã chọn
        await passwordField.sendKeys('short');
        await driver.findElement(By.css('button[type="button"]')).click();
        passwordErrorMessage = await driver.wait(until.elementLocated(By.xpath("(//small)[2]")), 5000);// XPath chọn phần tử <small> thứ 2  
        console.assert(await passwordErrorMessage.getText() === 'Password minximum 6 characters.', 'Không xuất hiện thông báo lỗi khi nhập mật khẩu không hợp lệ');
        console.log("Tất cả test case đều hoàn thành thành công");
    } catch (error) {
        console.error("Có lỗi trong quá trình kiểm thử:", error);
    } finally {
        await driver.quit();
    }
}

testLoginInput();
