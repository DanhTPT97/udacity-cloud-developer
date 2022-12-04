import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('bussiness-todo')
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
    return await todosAccess.getTodos(userId);
}

export const createTodo = async (userId: string, request: CreateTodoRequest): Promise<TodoItem> => {
    logger.log('info', 'Payload: '.concat(JSON.stringify(request)))
    const todoId = uuid.v4();
    const newTodo: TodoItem = {
        ...request,
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false
    }
    await todosAccess.createTodo(newTodo);
    return newTodo;
}

export const updateTodo = async (userId: string, todoId: string, request: UpdateTodoRequest): Promise<void> => {
    await todosAccess.updateTodo(userId, todoId, request)
}

export const deleteTodo = async (userId: string, todoId: string): Promise<void> => {
    await todosAccess.deleteTodo(userId, todoId)
}

export const createAttachmentPresignedUrl = async (userId: string, todoId: string): Promise<string> => {
    const url = await attachmentUtils.generateUploadURL(userId, todoId)
    return url
}

export const createResponse = async (code: number, body: any): Promise<any> => {
    return {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: body
    }
}

export const createErrorResponse = async (code: number, message: string): Promise<createError.HttpError> => {
    return createError(code, message)
}