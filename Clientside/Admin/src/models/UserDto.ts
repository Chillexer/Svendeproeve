interface UserDto {
    id: string,
    username: string,
    firstName: string
    lastName: string
    address: string
    town: string
    zipCode: number
    email: string
    phone: string
    imageUrl: string
    createdAt: Date
    updatedAt: Date
}


export default UserDto