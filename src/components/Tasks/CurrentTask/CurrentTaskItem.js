import { React, useState, useContext, useEffect } from "react";
import { TaskContext } from "../../../store/TaskContext";
import styles from "./CurrentTaskItem.module.css";
import TaskItemMenu from "./TaskItemMenu";

const CurrentTaskItem = (props) => {
    const { taskData, deleteTask, updateTask, taskStatus, updateTaskStatus } =
        useContext(TaskContext);
    const [checkedState, setCheckedState] = useState({});

    const handleCheckboxChange = (event) => {
        const checkboxId = event.target.id;
        const checked = event.target.checked;

        setCheckedState((prevState) => ({
            ...prevState,
            [checkboxId]: checked,
        }));

        if (checked) {
            updateTaskStatus(props.id);
        }
    };

    // Inicjalizuj checkedState kiedy taskData się zmieni
    useEffect(() => {
        const initialState = {};
        taskData.forEach((task) => {
            initialState[task.id] = false;
        });
        setCheckedState(initialState);
    }, [taskData]);

    //Making editable
    ////////////////////
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(props.title); // <-- poprawka: start → props.title

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            console.log("ID task ", props.id);
            updateTask(props.id, text);
            setIsEditing(false); // Zatwierdź zmianę
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        props.onHandleClick(false);
    };

    // Show modal menu
    ////////////////////////////

    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleRightClick = (event) => {
        event.preventDefault(); // Zapobiega domyślnemu menu kontekstowemu
        setShowMenu(true);

        // Ustawienie pozycji menu w miejscu kliknięcia
        setMenuPosition({
            x: event.clientX,
            y: event.clientY,
        });
    };

    // Nasłuchiwanie kliknięć poza menu
    const handleClickOutside = (event) => {
        if (showMenu && !event.target.closest(".context-menu")) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showMenu]);

    const handleEdit = () => {
        // <-- dodano, by uruchomić edycję
        setShowMenu(false);
        setIsEditing(true);
    };

    // Delete handler
    const handlerDelete = () => {
        deleteTask(props.id);
    };

    return (
        <li className={styles.taskLiItem}>
            {!taskStatus && (
                <input
                    id={props.id}
                    type="checkbox"
                    className={styles.currentTaskCheckbox}
                    checked={checkedState[props.id] || false}
                    onChange={handleCheckboxChange}
                />
            )}

            {isEditing ? (
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    autoFocus
                    className={styles.taskEditInput}
                />
            ) : (
                <p
                    className={styles.taskItemText}
                    onContextMenu={handleRightClick}
                >
                    {props.title}
                </p>
            )}

            {showMenu && (
                <TaskItemMenu
                    position={menuPosition}
                    onEdit={handleEdit}
                    onDelete={handlerDelete}
                />
            )}
        </li>
    );
};

export default CurrentTaskItem;
