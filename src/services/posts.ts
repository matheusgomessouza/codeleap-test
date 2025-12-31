import api from "./api"
  
  
 async function getPosts() {
    try {
      const response = await api.get("https://dev.codeleap.co.uk/careers/")
      return response.data
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to fetch posts: ${errorMessage}`)
    }
  }

  async function createPost(postData: { username: string; title: string; content: string }) {
    try {
      const response = await api.post("https://dev.codeleap.co.uk/careers/", postData)
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to create post: ${errorMessage}`)
    }
  }

  async function deletePost(postId: number) {
    try {
      await api.delete(`https://dev.codeleap.co.uk/careers/${postId}/`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to delete post: ${errorMessage}`)
    }
  }

  async function updatePost(postId: number, postData: { title: string; content: string }) {
    try {
      const response = await api.patch(`https://dev.codeleap.co.uk/careers/${postId}/`, postData)
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to update post: ${errorMessage}`)
    }
  }

  export { getPosts, createPost, deletePost, updatePost }