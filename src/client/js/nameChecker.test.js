import { checkForName } from './nameChecker'

describe('The function "checkForName()" should exist', () => {
    test('It should be defined', () => {
        expect(checkForName).toBeDefined();
    });

    test('The url should be valid, returns true if it is', () => {
        const urls = [
            "https://example.com",
            "http://example.com",
            "example.com",
            "example.com/path",
            "https://www.example.com"
        ];

        urls.forEach(url => {
            expect(checkForName(url)).toBeTruthy;
        });
    });

});
