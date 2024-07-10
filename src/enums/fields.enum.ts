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

export enum DoctorFormFields {
	Dni = "dni",
	FirstName = "firstName",
	LastName = "lastName",
	BirthDate = "birthDate",
	Sex = "sex",
	Phone = "phone",
	Email = "email",
	LocationAddress = "locationAddress"
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

export enum PatientFormFields {
	Dni = "dni",
	FirstName = "firstName",
	LastName = "lastName",
	BirthDate = "birthDate",
	Sex = "sex",
	Phone = "phone",
	LocationAddress = "locationAddress"
}

export enum AppointmentFields {
	Id = "id",
	Date = "date",
	IdDoctorCreation = "idDoctorCreation",
	IdPatient = "idPatient",
	Index = "index",
	Summary = "summary"
}
