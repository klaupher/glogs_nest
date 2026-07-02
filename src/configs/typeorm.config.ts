import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => {
    const syncronizer = process.env.DB_SYNCHRONIZE === '1';
    const autoLoader = process.env.DB_AUTO_LOAD_ENTITIES === '1';
    if (process.env.DB_TYPE === 'better-sqlite3') {
        return {
            type: 'better-sqlite3',
            database: process.env.DB_DATABASE || './db.sqlite',
            synchronize: syncronizer,
            autoLoadEntities: autoLoader,
            logger: 'debug',
        };
    }

    return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME?.toString() || 'postgres',
        password: process.env.DB_PASSWORD?.toString() || 'postgres',
        database: process.env.DB_DATABASE?.toString() || 'postgres',
        schema: process.env.DB_SCHEMA?.toString() || 'public',
        synchronize: process.env.DB_SYNCHRONIZE === '1',
        autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
    };
};

// type: 'postgres',
// host: 'localhost',
// port: 5432,
// username: 'postgres',
// password: 'postgres',
// database: 'glogs',
// schema: 'glogs',
// entities: [__dirname + '/../**/*.entity.{js,ts}'],
// synchronize: true,
// logging: true,
