var platforms = ["default", "unknown", "win32", "win64", "linux", "freebsd", "mac"];
var platform_override = null;

function detect_platform() {
    "use strict";

    if (platform_override !== null) {
        return platforms[platform_override];
    }

    var os = "unknown";

    if (navigator.platform == "Linux x86_64") {os = "linux";}
    if (navigator.platform == "Linux i686") {os = "linux";}
    if (navigator.platform == "Linux i686 on x86_64") {os = "linux";}
    if (navigator.platform == "Linux aarch64") {os = "linux";}
    if (navigator.platform == "Linux armv6l") {os = "linux";}
    if (navigator.platform == "Linux armv7l") {os = "linux";}
    if (navigator.platform == "Linux armv8l") {os = "linux";}
    if (navigator.platform == "Linux ppc64") {os = "linux";}
    if (navigator.platform == "Linux mips") {os = "linux";}
    if (navigator.platform == "Linux mips64") {os = "linux";}
    if (navigator.platform == "Mac") {os = "mac";}
    if (navigator.platform == "Win32") {os = "win32";}
    if (navigator.platform == "Win64" ||
        navigator.userAgent.indexOf("WOW64") != -1 ||
        navigator.userAgent.indexOf("Win64") != -1) { os = "win64"; }
    if (navigator.platform == "FreeBSD x86_64") {os = "freebsd";}
    if (navigator.platform == "FreeBSD amd64") {os = "freebsd";}
    // if (navigator.platform == "NetBSD x86_64") {os = "unix";}
    // if (navigator.platform == "NetBSD amd64") {os = "unix";}

    // I wish I knew by now, but I don't. Try harder.
    if (os == "unknown") {
        if (navigator.appVersion.indexOf("Win")!=-1) {os = "win32";}
        if (navigator.appVersion.indexOf("Mac")!=-1) {os = "mac";}
        if (navigator.appVersion.indexOf("FreeBSD")!=-1) {os = "freebsd";}
    }

    // Firefox Quantum likes to hide platform and appVersion but oscpu works
    if (navigator.oscpu) {
        if (navigator.oscpu.indexOf("Win32")!=-1) {os = "win32";}
        if (navigator.oscpu.indexOf("Win64")!=-1) {os = "win64";}
        if (navigator.oscpu.indexOf("Mac")!=-1) {os = "mac";}
        if (navigator.oscpu.indexOf("Linux")!=-1) {os = "linux";}
        if (navigator.oscpu.indexOf("FreeBSD")!=-1) {os = "freebsd";}
        // if (navigator.oscpu.indexOf("NetBSD")!=-1) {os = "unix";}
    }

    return os;
}

function adjust_for_platform() {
    "use strict";

    var platform = detect_platform();

    platforms.forEach(function (platform_elem) {
        var platform_div = document.getElementById("platform-instructions-" + platform_elem);
        platform_div.style.display = "none";
        if (platform == platform_elem) {
            platform_div.style.display = "block";
        }
    });

    adjust_platform_specific_instrs(platform);
}

function adjust_platform_specific_instrs(platform) {
    var platform_specific = document.getElementsByClassName("platform-specific");
    for (var el of platform_specific) {
        var el_is_not_win = el.className.indexOf("not-win") !== -1;
        var el_is_inline = el.tagName.toLowerCase() == "span";
        var el_visible_style = "block";
        if (el_is_inline) {
            el_visible_style = "inline";
        }
        if (platform == "win64" || platform == "win32") {
            if (el_is_not_win) {
                el.style.display = "none";
            } else {
                el.style.display = el_visible_style;
            }
        } else {
            if (el_is_not_win) {
                el.style.display = el_visible_style;
            } else {
                el.style.display = "none";
            }
        }
    }
}

function cycle_platform() {
    if (platform_override == null) {
        platform_override = 0;
    } else {
        platform_override = (platform_override + 1) % platforms.length;
    }
    adjust_for_platform();
}

function set_up_cycle_button() {
    var cycle_button = document.getElementById("platform-button");
    cycle_button.onclick = cycle_platform;

    var key="test";
    var idx=0;
    var unlocked=false;

    document.onkeypress = function(event) {
        if (event.key == "n" && unlocked) {
            cycle_platform();
        }

        if (event.key == key[idx]) {
            idx += 1;

            if (idx == key.length) {
                cycle_button.style.display = "block";
                unlocked = true;
                cycle_platform();
            }
        } else if (event.key == key[0]) {
            idx = 1;
        } else {
            idx = 0;
        }
    };
}

function go_to_default_platform() {
    platform_override = 0;
    adjust_for_platform();
}

function set_up_default_platform_buttons() {
    var defaults_buttons = document.getElementsByClassName('default-platform-button');
    for (var i = 0; i < defaults_buttons.length; i++) {
        defaults_buttons[i].onclick = go_to_default_platform;
    }
}

function fill_in_bug_report_values() {
    var nav_plat = document.getElementById("nav-plat");
    var nav_app = document.getElementById("nav-app");
    nav_plat.textContent = navigator.platform;
    nav_app.textContent = navigator.appVersion;
}

(function () {
    adjust_for_platform();
    set_up_cycle_button();
    set_up_default_platform_buttons();
    fill_in_bug_report_values();
}());
