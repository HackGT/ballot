export function normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if(isNaN(parsedPort)) {
        return port;
    }
    if(parsedPort >= 0) {
        return parsedPort;
    }
    return false;
}