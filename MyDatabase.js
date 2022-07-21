const { SQLDataSource } = require('datasource-sql');

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
    async getStudents(id) {
        const students = await this.knex
            .select("*")
            .from("students")
            .where({ id })
            .cache(MINUTE);
        return students;
    }

    async addStudents(name, roll) {
        const [id] = await this.knex
            .insert({ name, roll, })
            .into('students')
            .returning("id");
        return id;
    }

    async updateStudent(id, name) {
        await this.knex('students')
            .where({ id })
            .update({
                name
            });
    }
}

module.exports = MyDatabase;