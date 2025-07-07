"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand('cline-tab-references.copyTabPaths', async () => {
        try {
            // Get all open tabs
            const tabGroups = vscode.window.tabGroups.all;
            const filePaths = [];
            // Get workspace folder path for relative path calculation
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            const workspacePath = workspaceFolder?.uri.fsPath;
            // Iterate through all tab groups and tabs
            for (const tabGroup of tabGroups) {
                for (const tab of tabGroup.tabs) {
                    if (tab.input instanceof vscode.TabInputText) {
                        const filePath = tab.input.uri.fsPath;
                        // Convert to relative path if workspace is available
                        let relativePath;
                        if (workspacePath) {
                            relativePath = path.relative(workspacePath, filePath);
                            // Convert backslashes to forward slashes for consistency
                            relativePath = relativePath.replace(/\\/g, '/');
                        }
                        else {
                            relativePath = filePath;
                        }
                        // Format for Cline chat: @/path/to/file
                        const clineReference = `@/${relativePath}`;
                        filePaths.push(clineReference);
                    }
                }
            }
            if (filePaths.length === 0) {
                vscode.window.showInformationMessage('No open tabs found.');
                return;
            }
            // Remove duplicates and sort
            const uniquePaths = [...new Set(filePaths)].sort();
            // Join with newlines for easy copying
            const result = uniquePaths.join('\n');
            // Copy to clipboard
            await vscode.env.clipboard.writeText(result);
            // Show success message
            vscode.window.showInformationMessage(`Copied ${uniquePaths.length} tab path(s) to clipboard for Cline chat`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error copying tab paths: ${error}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map