interface ImageNodeProps {
  data: {
    messages?: string[];
    svg?: string;
  };
}

export const ImageNode = ({ data }: ImageNodeProps) => {
  const { messages = [], svg } = data;

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      {svg ? (
        <div
          style={{ width: '100%', height: '100%', background: 'transparent', border: 'none' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex justify-center items-center w-[800px] h-[600px] text-muted-foreground">
          {messages.length > 0 ? (
            <div className="flex flex-col gap-2">
              {messages.map((message, id) => (
                <div key={`${id.toString()}-message`}>{message}</div>
              ))}
            </div>
          ) : (
            <div>Preview will be available once the diagram is rendered</div>
          )}
        </div>
      )}
    </div>
  );
};
