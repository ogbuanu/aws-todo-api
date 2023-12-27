import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Todo from "../models/Todo";

export default class TodoService {
  private Tablename: string = "TodosTable";

  constructor(private docClient: DocumentClient) {}

  async getAllTodos(): Promise<Todo[]> {
    const params = {
      TableName: this.Tablename,
    };
    const result = await this.docClient.scan(params).promise();
    return result.Items as Todo[];
  }

  async createTodo(todo: Todo): Promise<Todo> {
    const params = {
      TableName: this.Tablename,
      Item: todo,
    };
    await this.docClient.put(params).promise();
    return todo;
  }

  async getTodo(id: string): Promise<Todo> {
    const params = {
      TableName: this.Tablename,
      Key: {
        todosId: id,
      },
    };
    const result = await this.docClient.get(params).promise();
    if (!result.Item) {
      throw new Error("Todo not found");
    }

    return result.Item as Todo;
  }

  async updateTodo(id: string, todo?: Partial<Todo>): Promise<Todo> {
    const params = {
      TableName: this.Tablename,
      Key: { todosId: id },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": true,
      },
      ReturnValues: "ALL_NEW",
    };
    const result = await this.docClient.update(params).promise();
    return result.Attributes as Todo;
  }

  async deleteTodo(id: string): Promise<void> {
    const params = {
      TableName: this.Tablename,
      Key: {
        todosId: id,
      },
    };
    await this.docClient.delete(params).promise();
  }
}
