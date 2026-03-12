package com.apartmentmanagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "apartments")
@Setter
@Getter
public class Apartment extends BaseEntity { // Chưa xong

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
