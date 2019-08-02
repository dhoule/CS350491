export class Feedback {

	constructor(
		public _id: string,
		public titlename: string,
		public firstname: string,
		public lastname: string,
		public email: string,
		public phone: string,
		public bodytext: string,
		public created_at: Date,
		public reference_id: string
	) {}
}
