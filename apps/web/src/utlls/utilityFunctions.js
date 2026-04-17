export function getAlignment(alignment) {
    switch (alignment) {
        case "Top Left":
            return {
                alignItems: "flex-start",
                justifyContent: "flex-start",
            };
        case "Top Center":
            return {
                alignItems: "center",
                justifyContent: "flex-start",
            };
        case "Top Right":
            return {
                alignItems: "flex-end",
                justifyContent: "flex-start",
            };
        case "Middle Left":
            return {
                alignItems: "flex-start",
                justifyContent: "center",
            };
        case "Center":
            return {
                alignItems: "center",
                justifyContent: "center",
            };
        case "Middle Right":
            return {
                alignItems: "flex-end",
                justifyContent: "center",
            };
        case "Bottom Left":
            return {
                alignItems: "flex-start",
                justifyContent: "flex-end",
            };
        case "Bottom Center":
            return {
                alignItems: "center",
                justifyContent: "flex-end",
            };
        case "Bottom Right":
            return {
                alignItems: "flex-end",
                justifyContent: "flex-end",
            };
    }
}
