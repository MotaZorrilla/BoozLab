<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class PediatricCalculatorTest extends TestCase
{
    /**
     * Regla de Clark:
     * Dosis Pediátrica = (Peso en kg / 70) * Dosis Adulto
     */
    public function test_clark_rule_calculation(): void
    {
        $weightKg = 21.0;
        $adultDoseMg = 500.0;

        $pediatricDose = ($weightKg / 70.0) * $adultDoseMg;

        $this->assertEquals(150.0, $pediatricDose);
    }

    /**
     * Regla de Young:
     * Dosis Pediátrica = [Edad (años) / (Edad + 12)] * Dosis Adulto
     */
    public function test_young_rule_calculation(): void
    {
        $ageYears = 4;
        $adultDoseMg = 400.0;

        $pediatricDose = ($ageYears / ($ageYears + 12)) * $adultDoseMg;

        $this->assertEquals(100.0, $pediatricDose);
    }

    /**
     * Cálculo directo por mg/kg/día:
     * Ejemplo Albendazol: 15 mg/kg/día dividido en 2 tomas
     */
    public function test_mg_per_kg_posology_calculation(): void
    {
        $weightKg = 16.0;
        $mgPerKgPerDay = 15.0;

        $dailyDoseMg = $weightKg * $mgPerKgPerDay; // 240 mg
        $dosePerAdministration = $dailyDoseMg / 2.0; // 120 mg cada 12h

        $this->assertEquals(240.0, $dailyDoseMg);
        $this->assertEquals(120.0, $dosePerAdministration);
    }
}
