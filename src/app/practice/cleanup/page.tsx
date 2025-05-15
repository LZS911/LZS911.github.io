'use client';

import { useState, useEffect } from 'react';

type CleanupStatus = {
  active: boolean;
  interval: number | null;
  message: string;
};

export default function CleanupPage() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<CleanupStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [interval, setInterval] = useState('86400000'); // 默认24小时
  const [intervalPreset, setIntervalPreset] = useState('86400000');

  // 从 localStorage 加载 API 密钥并获取状态
  useEffect(() => {
    // 尝试从 localStorage 获取 API 密钥
    const savedApiKey = localStorage.getItem('cleanup_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);

      // 使用保存的 API 密钥获取状态
      const getStatus = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/cleanup?key=${savedApiKey}&operation=status`
          );
          if (response.ok) {
            const data = await response.json();
            setStatus(data);
            setMessage('');
          } else {
            // API 密钥可能已失效，清除本地存储
            localStorage.removeItem('cleanup_api_key');
            const error = await response.json();
            setMessage(error.error || '获取状态失败，请重新输入 API 密钥');
          }
        } catch (error) {
          setMessage('获取状态失败: ' + (error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      getStatus();
    }
  }, []);

  // 获取状态
  const fetchStatus = async () => {
    if (!apiKey.trim()) {
      setMessage('请输入 API 密钥');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cleanup?key=${apiKey}&operation=status`
      );
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setMessage('');

        // 保存有效的 API 密钥到 localStorage
        localStorage.setItem('cleanup_api_key', apiKey);
      } else {
        const error = await response.json();
        setMessage(error.error || '获取状态失败');
      }
    } catch (error) {
      setMessage('获取状态失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 执行手动清理
  const runManualCleanup = async () => {
    if (!apiKey.trim()) {
      setMessage('请输入 API 密钥');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cleanup?key=${apiKey}&operation=manual`
      );
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || '清理完成');
        // 更新状态
        fetchStatus();
      } else {
        const error = await response.json();
        setMessage(error.error || '清理失败');
      }
    } catch (error) {
      setMessage('清理失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 启动定时清理
  const startScheduler = async () => {
    if (!apiKey.trim()) {
      setMessage('请输入 API 密钥');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/cleanup?key=${apiKey}&operation=start&interval=${interval}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || '定时任务已启动');
        // 更新状态
        fetchStatus();
      } else {
        const error = await response.json();
        setMessage(error.error || '启动任务失败');
      }
    } catch (error) {
      setMessage('启动任务失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 停止定时清理
  const stopScheduler = async () => {
    if (!apiKey.trim()) {
      setMessage('请输入 API 密钥');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/cleanup?key=${apiKey}&operation=stop`);
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || '定时任务已停止');
        // 更新状态
        fetchStatus();
      } else {
        const error = await response.json();
        setMessage(error.error || '停止任务失败');
      }
    } catch (error) {
      setMessage('停止任务失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 预设时间处理函数
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIntervalPreset(value);
    setInterval(value);
  };

  // 自定义时间处理函数
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterval(e.target.value);
    setIntervalPreset('custom');
  };

  // 格式化时间间隔
  const formatInterval = (ms: number): string => {
    if (ms < 60000) {
      return `${ms / 1000}秒`;
    } else if (ms < 3600000) {
      return `${ms / 60000}分钟`;
    } else if (ms < 86400000) {
      return `${ms / 3600000}小时`;
    } else {
      return `${ms / 86400000}天`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">临时文件清理管理</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label
            htmlFor="apiKey"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            API 密钥
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            placeholder="输入 API 密钥"
          />
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            获取状态
          </button>
          <button
            onClick={runManualCleanup}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            手动清理
          </button>
        </div>

        {status && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-6">
            <h2 className="font-bold mb-2">当前状态</h2>
            <p>定时任务: {status.active ? '运行中' : '已停止'}</p>
            {status.interval && (
              <p>清理间隔: {formatInterval(status.interval)}</p>
            )}
            <p>状态信息: {status.message}</p>
          </div>
        )}

        <div className="border-t border-gray-300 dark:border-gray-600 pt-6 mb-4">
          <h2 className="font-bold mb-4">定时任务管理</h2>

          <div className="mb-4">
            <label
              htmlFor="intervalPreset"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              清理间隔预设
            </label>
            <select
              id="intervalPreset"
              value={intervalPreset}
              onChange={handlePresetChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="3600000">1小时</option>
              <option value="7200000">2小时</option>
              <option value="21600000">6小时</option>
              <option value="43200000">12小时</option>
              <option value="86400000">1天</option>
              <option value="604800000">1周</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="interval"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              自定义间隔 (毫秒)
            </label>
            <input
              id="interval"
              type="number"
              value={interval}
              onChange={handleIntervalChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="清理间隔 (毫秒)"
              min="60000"
            />
            <p className="text-sm text-gray-500 mt-1">
              当前设置: {formatInterval(parseInt(interval, 10) || 0)}
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={startScheduler}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              启动定时任务
            </button>
            <button
              onClick={stopScheduler}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              停止定时任务
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${message.includes('失败') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 text-center">
        <a href="/practice" className="text-blue-500 hover:underline">
          返回写作页面
        </a>
      </div>
    </div>
  );
}
