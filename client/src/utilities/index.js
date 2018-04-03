export function server() {
    return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
}
