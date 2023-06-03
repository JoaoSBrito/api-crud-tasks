import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

// Create database class as a module
export class Database {

  // Private field that stores the data
  #database ={}

  // Read the databasePath File and convert it into a Object JS and assigned to the #database.
  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist
      })
  }
  
  // private filed that stores the content of the database in a JSON File
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }


  // Method who receives the name and a object "search" and returns the corresponding data.
  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true

          return row[key].includes(value)
        })
      })
    }

    return data
  }

  // Method who receives the name and a object "data" and inserts the data into the database.
  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }


    this.#persist()

    return data;
  } 


  // Method who receives the name and the ID and deletes the task who the ID's corresponding. Also return true/ false depending on the results
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id) 

    if( rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
      return true
    }
    return false

  }

  // Method who receives the name, id and the object "data" and update the task who the ID's corresponding. Also return true/ false depending on the results
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id ===id)

    if (rowIndex > -1) {
      const row = this.#database[table][rowIndex]
      this.#database[table][rowIndex] = {id,...row, ...data}
      this.#persist()
      return true
    }

    return false

  }
}