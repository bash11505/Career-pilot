function UserGreetings({ isLoggedIn, name }) {
    if (!isLoggedIn) {
        return (
            <h1>
                Login
            </h1>
        );
    }

    return (
        <h1>
            Welcome To Spark Analyzer{" "}
            {name || "User"}
        </h1>
    );
}

export default UserGreetings;