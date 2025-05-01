import useBreadcrumbs from "@/hooks/use-breadcrums";
import { Card } from "../ui/card"
import UsersTableWrapper from "./users-data-table/users-table-wrapper"
import { useEffect, useState } from "react";
import { User, UserEntity } from "@/model/User";
import { addUser, deleteUser, editUser, getUsersSubscribtions } from "@/http/user";
import UsersSectionCards from "./users-section-cards";
import { Course } from "@/model/Course";
import { getCourses } from "@/http/course";

const UsersSection = () => {

    useBreadcrumbs([{ label: "Utenti", url: "#" }]);
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function fetchCourses() {
            const [users, courses] = await Promise.all([
                getUsersSubscribtions(),
                getCourses()
            ]);
            hydrateUsersWithCourses(users, courses);
            setUsers(users);
            setCourses(courses);
            setLoading(false);
        }
        fetchCourses();
    }, [])

    const hydrateUsersWithCourses = (users: UserEntity[], courses: Course[]) => {
        for (const user of users) {
            user.courses = courses.filter(c => user.subscribers.some(s => s.courseId === c.id) );
        }
    }

    const onAddUser = async (user: User) => {
        try {
            setLoading(true);
            const addedUser = await addUser(user) as UserEntity;
            addedUser.subscribers = [];
            addedUser.courses = [];
            setUsers([...users, addedUser]);
        } catch (e) {
           //Toast   
        }
        finally {
            setLoading(false); 
        }
    }

    const onEditUser = async (user: User) => {
        try {
            setLoading(true);
            const editedUser = await editUser(user) as UserEntity;
            editedUser.subscribers = users.find(u => u.id === editedUser.id)?.subscribers || [];
            setUsers(users.map(u => u.id === editedUser.id ? editedUser : u));
        } catch (e) {
           //Toast   
        }
        finally {
            setLoading(false); 
        }
    }

    const onDeleteUser = async (id: string) => {
        try {
            setLoading(true);
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (e) {
           //Toast
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 @xl/main:grid-cols-4 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                <UsersSectionCards users={users} loading={loading} />

                <Card className="col-span-1 sm:col-span-4 flex flex-col px-4 py-4">
                    <UsersTableWrapper users={users} onAddUser={onAddUser} onEditUser={onEditUser} onDeleteUser={onDeleteUser} loading={loading}/>
                </Card>
            </div>
        </>
    )
}
export default UsersSection