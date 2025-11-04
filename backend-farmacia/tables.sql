
CREATE TABLE medicos (
  id_medico INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  especialidad VARCHAR(45) NOT NULL,
  matricula VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_medico)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pacientes (
  id_paciente INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  apellido VARCHAR(45) NOT NULL,
  dni VARCHAR(20) NOT NULL UNIQUE,
  fecha_nacimiento DATE NOT NULL,
  obra_social VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_paciente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE turnos (
  id_turno INT NOT NULL AUTO_INCREMENT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente','atendido','cancelado') NOT NULL DEFAULT 'pendiente',
  observaciones VARCHAR(255) DEFAULT NULL,
  id_paciente INT NOT NULL,
  id_medico INT NOT NULL,
  PRIMARY KEY (id_turno),
  FOREIGN KEY (id_medico) REFERENCES medicos(id_medico),
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
