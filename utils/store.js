const { reactive } = Vue;

export const store = reactive({
    user: null,
    loading: false,
    isAuthorized: null, // Will be set to AuthorizationStatus instance
});

// Import AuthorizationStatus here or define it
class AuthorizationStatus {
    static Visitor = new AuthorizationStatus("visitor");
    static Authorized = new AuthorizationStatus("authorized");
    static Unauthorized = new AuthorizationStatus("unauthorized");

    constructor(name) {
        this.name = name;
    }
}

store.isAuthorized = AuthorizationStatus.Visitor;

export { AuthorizationStatus };