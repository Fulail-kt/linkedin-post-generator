import { b } from '../../../../baml_client';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);
    const post = await b.GeneratePost(body);
    console.log(post);
    
    return Response.json(post);
  } catch (error) {
    console.error('Error generating post:', error);
    return Response.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    );
  }
}