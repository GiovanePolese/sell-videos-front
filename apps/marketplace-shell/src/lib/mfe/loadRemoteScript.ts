'use client';

export async function loadRemoteScript(remoteUrl: string) {
  if (!remoteUrl) throw new Error('Missing remote url');
  const existing = document.querySelector(`script[data-remote="${remoteUrl}"]`);
  if (existing) return;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = remoteUrl;
    script.dataset.remote = remoteUrl;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
    document.head.appendChild(script);
  });
}
