import { TodosAccess } from './TodosAccess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const logger = createLogger('helpers-todo')
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
    return await todosAccess.getTodos(userId);
}

export const createTodo = async (userId: string, request: CreateTodoRequest): Promise<TodoItem> => {
    const todoId = uuid.v4();
    const newTodo: TodoItem = {
        ...request,
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false
    }
    logger.log('info', JSON.stringify(newTodo))

    await todosAccess.createTodo(newTodo);
    return newTodo;
}

export const updateTodo = async (userId: string, todoId: string, request: UpdateTodoRequest): Promise<void> => {
    logger.log('info', JSON.stringify(request))
    await todosAccess.updateTodo(userId, todoId, request)
}

export const deleteTodo = async (userId: string, todoId: string): Promise<void> => {
    await todosAccess.deleteTodo(userId, todoId)
}

export const createAttachmentPresignedUrl = async (userId: string, todoId: string): Promise<string> => {
    const url = await attachmentUtils.generateUploadURL(userId, todoId)
    logger.log('info', 'Url: ' + url)
    return url
}