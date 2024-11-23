class User {
    constructor(uid, name, email, phone_number, birth_date, photo_URL, time_created) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.phone_number = phone_number;
        this.birth_date = birth_date;
        this.photo_URL = photo_URL;
        this.timeCreated = time_created
    }

    toObject() {
        return {
            uid: this.uid,
            name: this.name,
            email: this.email,
            phone_number: this.phone_number,
            birth_date: this.birth_date,
            photo_URL: this.photo_URL,
            time_created: this.time_created
        }
    }

    printInfo() {
        console.log(`User Info:
            UID: ${this.uid}
            Name: ${this.name}
            Email: ${this.email}
            Phone Number: ${this.phone_number}
            Birth Date: ${this.birth_date}
            Photo URL: ${this.photo_URL}
            Time Created: ${this.time_created}`);
    }
}

module.exports = User;