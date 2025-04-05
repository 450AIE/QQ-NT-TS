import betterSQlite3 from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { Message } from '../types/message'

class DBManager {
    private db: betterSQlite3.Database
    constructor() {
        // 这里传递的db文件会自动创建
        this.db = new betterSQlite3(join(app.getPath('userData'), 'message.db'))
        this.db.pragma('journal_mode = WAL')
    }
    createTable(tableName: string, tableSchema: string) {
        try {
            this.db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${tableSchema})`).run()
            console.log('创建表格成功', tableSchema)
        } catch (err) {
            console.error('创建表格失败', err.message)
        }
    }

    insert(tableName: string, data: Record<string, any>) {
        const keys = Object.keys(data).join(',')
        const placeholders = Object.keys(data)
            .map(() => '?')
            .join(',')
        const values = Object.values(data)
        try {
            const stmt = this.db.prepare(
                `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`
            )
            stmt.run(...values)
            console.log('插入数据成功')
        } catch (err) {
            console.error('插入数据失败', err.message)
        }
    }

    async query(tableName: string, condition: string = '1=1', params: any[] = []) {
        try {
            const stmt = this.db.prepare(`SELECT * FROM ${tableName} WHERE ${condition}`)
            const rows = stmt.all(...params)
            // console.log('查询数据成功', rows)
            return rows
        } catch (err) {
            console.error('查询数据失败', err.message)
            throw err
        }
    }

    update(tableName: string, data: Record<string, any>, condition: string, params: any[] = []) {
        const set = Object.keys(data)
            .map((key) => `${key}=?`)
            .join(',')
        const values = [...Object.values(data), ...params]

        try {
            const stmt = this.db.prepare(`UPDATE ${tableName} SET ${set} WHERE ${condition}`)
            stmt.run(...values)
            console.log('更新数据成功')
        } catch (err) {
            console.error('更新数据失败', err.message)
        }
    }

    delete(tableName: string, condition: string, params: any[] = []) {
        try {
            const stmt = this.db.prepare(`DELETE FROM ${tableName} WHERE ${condition}`)
            stmt.run(...params)
            console.log('删除数据成功')
        } catch (err) {
            console.error('删除数据失败', err.message)
        }
    }

    close() {
        try {
            this.db.close()
            console.log('关闭数据库成功')
        } catch (err) {
            console.error('关闭数据库失败', err.message)
        }
    }

    tableExists(tableName: string): boolean {
        try {
            const result = this.db
                .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`)
                .get(tableName)
            return !!result
        } catch (err) {
            console.error('检查表存在失败', err.message)
            return false
        }
    }
}

class MessageDB {
    private db: DBManager
    constructor(db: DBManager) {
        this.db = db
    }
    createMessageTable() {
        this.db.createTable(
            'message',
            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'message TEXT NOT NULL, ' +
                'senderId INTEGER NOT NULL, ' +
                'receiverId INTEGER NOT NULL, ' +
                'timestamp INTEGER NOT NULL, ' +
                "type TEXT CHECK(type IN ('user', 'group')) NOT NULL"
        )
    }
    insertMessage(msg: Message) {
        this.db.insert('message', msg)
    }
    queryMessage(condition: string = '1=1') {
        return this.db.query('message', condition)
    }
    updateMessage(data: any, condition: string) {
        this.db.update('message', data, condition)
    }
    deleteMessage(condition: string) {
        this.db.delete('message', condition)
    }
    close() {
        this.db.close()
    }
    getAllMessages() {
        return this.db.query('message')
    }

    messageTableExists(): boolean {
        return this.db.tableExists('message')
    }
}

const DBManagerInstance = new DBManager()
export const MessageDBInstance = new MessageDB(DBManagerInstance)
