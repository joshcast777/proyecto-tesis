export enum AuthFields {
	Email = "email",
	Password = "password"
}

export enum DoctorFields {
	Id = "id",
	BirthDate = "birthDate",
	CreationDate = "creationDate",
	Dni = "dni",
	Email = "email",
	FirstName = "firstName",
	LastName = "lastName",
	LocationAddress = "locationAddress",
	Phone = "phone",
	Role = "role",
	Sex = "sex",
	Status = "status",
	UpdateDate = "updateDate"
}

export enum PatientFields {
	Id = "id",
	Appointments = "appointments",
	BirthDate = "birthDate",
	CreationDate = "creationDate",
	Dni = "dni",
	FirstName = "firstName",
	LastName = "lastName",
	IdDoctorCreation = "idDoctorCreation",
	LastAppointment = "lastAppointment",
	LocationAddress = "locationAddress",
	Phone = "phone",
	Sex = "sex"
}

export enum AppointmentFields {
	Id = "id",
	Date = "date",
	IdDoctorCreation = "idDoctorCreation",
	IdPatient = "idPatient",
	Index = "index",
	Summary = "summary"
}
