import { Password } from './../services/password';
import mongoose, { NativeError } from 'mongoose';

interface UserAttrs {
	email: string;
	password: string;
}

//interface to tell TS what exists on the User Model because it doesn't understand statics
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

//An interface that describe the properties that a User Document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
			delete ret.password;
			delete ret.__v
		}
	}
});

userSchema.pre('save', async function(done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

userSchema.static('build', (attrs: UserAttrs) => {
	return new User(attrs);
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };