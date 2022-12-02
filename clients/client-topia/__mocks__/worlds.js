"use strict";
exports.__esModule = true;
exports.worlds = void 0;
var baseImageURL = "https://firebasestorage.googleapis.com/v0/b/topia-ba1c8.appspot.com/o/heroImages%";
exports.worlds = [
    {
        description: "This is the a welcome lobby that anybody can enter to learn more about Topia.",
        name: "Welcome",
        heroImage: "".concat(baseImageURL, "2Fwelcome_banner.png?alt=media&token=548e1515-205e-4ef0-a0ca-bc4cc39c4f40"),
        urlSlug: "welcome"
    },
    {
        background: null,
        created: {
            _seconds: 1605310924,
            _nanoseconds: 165000000
        },
        controls: {
            isShowingCurrentGuests: true,
            hideShareScreen: false,
            isZoneConversationHidden: false,
            allowUserToTurnOnNotifications: true,
            isPeerConversationHidden: false,
            disableHideVideo: false,
            isWorldConversationHidden: false,
            allowUsersToTurnOnNotifications: true,
            allowMuteAll: true,
            isMobileDisabled: false
        },
        description: "A place to play, test, create scenes, and more!",
        enforceWhitelistOnLogin: false,
        forceAuthOnLogin: true,
        height: 3096,
        heroImage: "https://firebasestorage.googleapis.com/v0/b/topia-ba1c8.appspot.com/o/heroImages%2F2OB4pQL4b6ReyRfh6TOVJlx8vDz2-lina-1632521548284.png?alt=media&token=b95f15ac-f598-438e-95e8-4c048ec091a7",
        mapExists: true,
        name: "Lina's World",
        redirectTo: null,
        spawnPosition: {
            radius: 100,
            y: -348,
            x: -1448
        },
        tileBackgroundEverywhere: null,
        useTopiaPassword: false,
        width: 4096
    },
    {
        alt: "descriptive text for screen reader",
        description: "Donec ullamcorper nulla non metus auctor fringilla. Donec ullamcorper nulla non metus auctor fringilla. Donec ullamcorper nulla non metus auctor fringilla",
        name: "World Name that goes on for days",
        heroImage: "https://bit.ly/2QdnMge",
        urlSlug: "world-name-that-goes-on-forever-because-it-free"
    },
];
