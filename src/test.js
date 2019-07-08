function getMaufacturerId(url) {
    var exp = /\/manufacturers\/(\d+)/i;
    const res = exp.exec(url);
    if (res) {
        return res[1];
    }
    return null;
}

function isMaufacturer(url) {
    var exp = /\/manufacturers(?:[$\/&\?])/i;
    const res = exp.exec(url);
    return Boolean(res);
}

function getCategoryId(url) {
    var exp = /\/categories\/(\d+)/i;
    const res = exp.exec(url);
    if (res) {
        return res[1];
    }
    return null;
}

function isCategory(url) {
    var exp = /\/categories(?:[$\/&\?])/i;
    const res = exp.exec(url);
    return Boolean(res);
}

function getProductId(url) {
    var exp = /\/product\/(\d+)/i;
    const res = exp.exec(url);
    if (res) {
        return res[1];
    }
    return null;
}

function isProduct(url) {
    var exp = /\/product(?:[$\/&\?])/i;
    const res = exp.exec(url);
    return Boolean(res);
}

function getPage(url) {
    var exp = /(?:\?|&)page=(\d+)/i;
    const res = exp.exec(url);
    if (res) {
        return res[1];
    }
    return 1;
}

function isLogin(url) {
    var exp = /\/login(?:[$\/&\?])/i;
    const res = exp.exec(url);
    return Boolean(res);
}

function isCart(url) {
    var exp = /\/cart(?:[$\/&\?])/i;
    const res = exp.exec(url);
    return Boolean(res);
}

const url = '/manufacturers/123/categories/234/product/345/cart/login?page=567?page=456';

console.log('getMaufacturerId: ' + getMaufacturerId(url));
console.log('isMaufacturer: ' + isMaufacturer(url));

console.log('getCategoryId: ' + getCategoryId(url));
console.log('isCategory: ' + isCategory(url));

console.log('getProductId: ' + getProductId(url));
console.log('isProduct: ' + isProduct(url));

console.log('getPage: ' + getPage(url));

console.log('isLogin: ' + isLogin(url));

console.log('isCart: ' + isCart(url));
