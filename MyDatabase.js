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

    async queryStudents(keyword, { pageIndex, pageSize }) {
        const offset = (pageIndex - 1) * pageSize;
        const results = await this.knex()
            .select("*")
            .from('students')
            // .paginate({ perPage: pageSize, currentPage: pageIndex, })
            .where((builder) => {
                if (keyword != "") {
                    builder.whereLike('name', `%${keyword}%`);
                }
            })
            .orderBy("id", "desc")
            .limit(pageSize, { skipBinding: true })
            .offset(offset)
            ;            

        return results;
    }
}

module.exports = MyDatabase;