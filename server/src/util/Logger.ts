import chalk from 'chalk';

export default class Logger {
    public static error(message: string) {
        console.error(chalk.redBright('[Error]'), message);
    }

    public static info(message: string) {
        console.info(chalk.blueBright('[Info]'), message);
    }

    public static success(message: string) {
        console.info(chalk.green('[Info]'), message);
    }
}
