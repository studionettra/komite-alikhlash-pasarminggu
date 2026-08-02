<?php

namespace App\Services;

use Exception;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\Permission;
use Google\Service\Sheets;
use Google\Service\Sheets\ClearValuesRequest;
use Google\Service\Sheets\ValueRange;

class GoogleSheetsService
{
    protected $client;

    protected $service;

    protected $driveService;

    public function __construct()
    {
        $this->client = new Client;
        $this->client->setApplicationName('Komite Keuangan App');
        // Menambahkan Scope untuk Drive agar bisa mengubah permission file yang baru dibuat
        $this->client->setScopes([
            Sheets::SPREADSHEETS,
            Drive::DRIVE,
        ]);
        $this->client->setAccessType('offline');

        $credentialsPath = storage_path('app/google-credentials.json');

        if (file_exists($credentialsPath)) {
            $this->client->setAuthConfig($credentialsPath);
        } else {
            throw new Exception('File google-credentials.json tidak ditemukan di storage/app/.');
        }

        $this->service = new Sheets($this->client);
        $this->driveService = new Drive($this->client);
    }

    protected function getSpreadsheetId()
    {
        // Try getting from settings.json first
        $settingsPath = storage_path('app/settings.json');
        if (file_exists($settingsPath)) {
            $settings = json_decode(file_get_contents($settingsPath), true);
            if (! empty($settings['google_spreadsheet_id'])) {
                return $settings['google_spreadsheet_id'];
            }
        }

        // Fallback to .env
        $envId = env('GOOGLE_SPREADSHEET_ID');
        if (! empty($envId)) {
            return $envId;
        }

        throw new Exception('URL/ID Google Spreadsheet belum diatur. Silakan atur di menu Pengaturan.');
    }

    /**
     * Clear data from a specific range in Google Sheets
     *
     * @param  string  $range  The range to clear (e.g., 'Sheet1!A:F')
     * @return bool
     */
    public function clearRange(string $range)
    {
        $spreadsheetId = $this->getSpreadsheetId();
        $requestBody = new ClearValuesRequest;

        try {
            $response = $this->service->spreadsheets_values->clear($spreadsheetId, $range, $requestBody);

            return $response->getClearedRange() !== null;
        } catch (Exception $e) {
            throw new Exception('Gagal menghapus data di Google Sheets: '.$e->getMessage());
        }
    }

    /**
     * Write data to Google Sheets
     *
     * @param  string  $range  The range to write to (e.g., 'Sheet1!A1')
     * @param  array  $values  2D array of values
     * @return bool
     */
    public function appendData(string $range, array $values)
    {
        $spreadsheetId = $this->getSpreadsheetId();

        $body = new ValueRange([
            'values' => $values,
        ]);

        $params = [
            'valueInputOption' => 'USER_ENTERED',
        ];

        try {
            $result = $this->service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);

            return $result->getUpdates()->getUpdatedCells() > 0;
        } catch (Exception $e) {
            throw new Exception('Gagal menulis ke Google Sheets: '.$e->getMessage());
        }
    }
}
