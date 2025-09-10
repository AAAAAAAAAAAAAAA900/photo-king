import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";

// For navigation outside react components
export const navigationRef = createNavigationContainerRef();

// navigates to login
export function resetToLogin() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }],
            })
        );
    }
}