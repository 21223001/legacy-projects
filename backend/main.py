import pyautogui
import time
import tkinter as tk
from threading import Thread
import configparser


config = configparser.ConfigParser()
config.read('config.ini')  


# 座標取得クラス
class MousePositionTracker:
    def __init__(self, update_interval):
        self.update_interval = update_interval  # 座標更新の間隔（秒）
        self.x = 0
        self.y = 0

    def update_position(self):
        """ 現在のマウス位置を取得し、インスタンス変数に保存する """
        self.x, self.y = pyautogui.position()

    def get_position(self):
        """ 現在のマウス位置を返す """
        return self.x, self.y

    def track_position(self):
        """ 座標を一定間隔で更新し続ける """
        while True:
            self.update_position()
            time.sleep(self.update_interval)

# 特定の処理を纏めるクラス（今後処理を追加するための空のクラス）
class ActionHandler:
    def __init__(self):
        pass

    # 今後、時間経過後の動作やその他の処理をここに追加する
    def execute_action(self):
        pass

# GUIクラス
class MouseTrackerGUI:
    def __init__(self, root, tracker):
        self.root = root
        self.tracker = tracker

        # ラベル表示の設定
        self.label = tk.Label(root, text="現在のマウス位置: (0, 0)", font=("Helvetica", 14))
        self.label.pack(pady=20)

        # GUIを更新するためのボタン
        self.refresh_button = tk.Button(root, text="位置を更新", command=self.update_position)
        self.refresh_button.pack(pady=20)

        # 更新を定期的に行う
        self.update_gui_position()

    def update_position(self):
        """ マウス位置をGUIに更新 """
        x, y = self.tracker.get_position()
        self.label.config(text=f"現在のマウス位置: ({x}, {y})")

    def update_gui_position(self):
        """ 0.1秒ごとにGUIを更新する """
        self.update_position()
        self.root.after(100, self.update_gui_position)  # 0.1秒後に再実行



# メイン（実行）クラス
class MainApp:
    def __init__(self):
        # マウス位置トラッカーのインスタンス作成
        self.tracker = MousePositionTracker(update_interval)
        
        # スレッドでマウス位置をトラッキング
        self.tracking_thread = Thread(target=self.tracker.track_position, daemon=True)
        self.tracking_thread.start()

        # GUIの設定
        self.root = tk.Tk()
        self.root.title("Mouse Track")
        self.gui = MouseTrackerGUI(self.root, self.tracker)

    def run(self):
        """ アプリケーションを実行 """
        self.root.mainloop()

if __name__ == "__main__":

    update_interval = float(config['settings']['update_interval'])

    app = MainApp()
    app.run()
